// Services
import { DatabaseService, TABLES } from "@/services/database/database.service";
import { NotificationService } from "@/services/notification/notification.service";

// Expo File System
import { File, Paths } from "expo-file-system";

// Stores
import { useCareHistoryStore } from "@/stores/use-care-history-store";
import { useCareStore } from "@/stores/use-care-store";
import { usePlantStore } from "@/stores/use-plant-store";

// Expo Sharing
import * as Sharing from "expo-sharing";

// Expo Image Manipulator
import * as ImageManipulator from "expo-image-manipulator";

// Expo Document Picker
import * as DocumentPicker from "expo-document-picker";

// Days Js
import dayjs from "dayjs";

// Schema
import { type CaresHistory } from "@/services/care/care-history.schema";
import { type Cares } from "@/services/care/care.schema";
import { type Plant, type Plants } from "@/services/plant/plant.schema";
import { backupSchema, type Backup } from "./storage.schema";

// Utils
import { getNotificationBody, getNotificationTitle } from "@/utils";

/**
 * Serviço de armazenamento de imagens e arquivos
 * @description Responsável por gerenciar o armazenamento de imagens e arquivos no dispositivo, incluindo funções como salvar e deletar imagens
 */
export class StorageService implements IService {
  constructor(
    private database: DatabaseService,
    private notification: NotificationService,
  ) {}

  /**
   * Inicializa o serviço de armazenamento (roda na inicialização do app)
   */
  async init(): Promise<void> {}

  /**
   * Salva imagem localmente
   * @description Comprime e redimensiona a imagem antes de salvar para o dispositivo
   * @param uri URI da imagem a ser salva
   */
  async saveImage(uri: string): Promise<string> {
    try {
      // 1. Cria um contexto de manipulação para a imagem
      const context = ImageManipulator.ImageManipulator.manipulate(uri);

      // 2. Redimensiona para até 512  (height e width), mantendo a proporção
      context.resize({ width: 512 });

      // 3. Renderiza a imagem manipulada
      const imageRef = await context.renderAsync();

      // 4. Salva em um arquivo temporário
      const manipulatedResult = await imageRef.saveAsync({
        compress: 0.8, // valor de compressão entre 0 e 1
        format: ImageManipulator.SaveFormat.JPEG,
      });

      // 5. Cria nome único para o arquivo
      const fileName = `${Date.now()}.jpg`;

      // 6. Cria referência do arquivo destino
      const destination = new File(Paths.document, fileName);

      // 7. Copia o arquivo manipulado para o destino
      // OBS: aqui usamos o URI retornado pelo manipulator (manipulatedResult.uri)
      const source = new File(manipulatedResult.uri);
      source.copy(destination);

      // 8. Retorna o URI final (ex: file:///…/Documents/123456789.jpg)
      return destination.uri;
    } catch (error: any) {
      console.error("Falha ao salvar imagem otimizada:", error);
      throw error;
    }
  }

  /**
   * Deleta imagem
   * @param path URI da imagem a ser deletada
   */
  async deleteImage(path: string): Promise<void> {
    try {
      // 1. Cria referência do arquivo
      const file = new File(path);

      // 2. Verifica se o arquivo existe
      if (file.exists) {
        // 3. Deleta o arquivo
        file.delete();
      }
    } catch (error) {
      console.warn("Falha ao deletar imagem:", path, error);
    }
  }

  /**
   * Exporta dados do app (backup)
   */
  async exportData(): Promise<void> {
    try {
      // 1. Busca dados
      const plants = await this.database.getAll<Plant>(`SELECT * FROM ${TABLES.plants}`);
      const cares = await this.database.getAll(`SELECT * FROM ${TABLES.care_schedule}`);
      const history = await this.database.getAll(`SELECT * FROM ${TABLES.care_history}`);
      const notifications = await this.database.getAll(`SELECT * FROM ${TABLES.notifications}`);

      // 2. Coleta imagens únicas
      const imagesMap: Record<string, string> = {};

      for (const plant of plants) {
        if (!plant.image) continue;

        try {
          const fileName = plant.image.split("/").pop();
          if (!fileName) continue;

          const file = new File(Paths.document, fileName);

          if (!file.exists) {
            console.warn("Imagem não encontrada:", plant.image);
            continue;
          }

          const base64 = file.base64Sync();

          imagesMap[fileName] = base64;

          // salva só o nome no backup
          plant.image = fileName;
        } catch (err) {
          console.warn("Erro ao processar imagem:", plant.image, err);
        }
      }

      const now = dayjs();

      // 3. Monta backup
      const backup: Backup = {
        schema_version: 1,
        exported_at: now.toISOString(),
        data: {
          plants,
          cares,
          history,
          notifications,
        },
        images: imagesMap,
      };

      // 4. Salva arquivo
      const fileName = `planty-backup-${now.valueOf()}.json`;
      const file = new File(Paths.document, fileName);

      file.write(JSON.stringify(backup));

      // 5. Compartilha
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri);
      }
    } catch (error: any) {
      throw new Error(error.message || "Não foi possível exportar os dados");
    }
  }

  /**
   * Importa dados (backup)
   *
   * 1. Valida o arquivo de backup
   * 2. Apaga imagens antigas
   * 3. Limpa o banco de dados
   * 4. Insere os novos dados
   */
  async importData(): Promise<boolean> {
    try {
      // 1. Seleciona arquivo
      const result = await this.pickDocument();
      if (!result) return false;

      // 2. Lê arquivo
      const backupFile = new File(result.uri);
      const content = await backupFile.text();
      const data = JSON.parse(content);

      // 3. Valida backup
      const backup = backupSchema.parse(data);

      // 4. Remove imagens antigas
      const oldPlants = await this.database.getAll<Plant>(`SELECT * FROM ${TABLES.plants}`);
      for (const plant of oldPlants) {
        if (plant.image) {
          try {
            const file = new File(plant.image);
            const info = file.info();
            if (info.exists) file.delete();
          } catch (error: any) {
            console.warn(error.message || "Não foi possível apagar imagem:");
          }
        }
      }

      // 5. Limpa o banco
      await this.database.run(`DELETE FROM ${TABLES.plants}`);
      await this.database.run(`DELETE FROM ${TABLES.care_schedule}`);
      await this.database.run(`DELETE FROM ${TABLES.care_history}`);

      // Limpa as notificações agendadas e remove do banco de dados (expo + db + store)
      await this.notification.clearAll();

      //  6. Restaura imagens
      for (const [fileName, base64] of Object.entries(backup.images ?? {})) {
        try {
          const file = new File(Paths.document, fileName);
          file.write(base64, { encoding: "base64" });
        } catch (error: any) {
          console.warn(`Não foi possível restaurar a imagem ${fileName}:`, error.message);
        }
      }

      // 7. Restaura plantas
      const plants: Plants = [];

      for (const p of backup.data.plants ?? []) {
        const imagePath = p.image ? new File(Paths.document, p.image).uri : null;

        await this.database.run(
          `INSERT INTO ${TABLES.plants} (id, image, name, location, sunlight, temperature_max, temperature_min, humidity, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            p.id,
            imagePath,
            p.name,
            p.location,
            p.sunlight,
            p.temperature_max,
            p.temperature_min,
            p.humidity,
            p.created_at,
          ],
        );

        plants.push({ ...p, image: imagePath });
      }

      // 8. Restaura cares
      const cares: Cares = [];

      for (const care of backup.data.cares ?? []) {
        await this.database.run(
          `INSERT INTO ${TABLES.care_schedule} (id, plant_id, type, interval_days, last_done, next_due, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [care.id, care.plant_id, care.type, care.interval_days, care.last_done, care.next_due, care.created_at],
        );

        cares.push(care);
      }

      // 9. Restaura histórico
      const history: CaresHistory = [];

      for (const h of backup.data.history ?? []) {
        await this.database.run(
          `INSERT INTO ${TABLES.care_history} (id, plant_id, type, interval_days, done_at, care_schedule_id) VALUES (?, ?, ?, ?, ?, ?)`,
          [h.id, h.plant_id, h.type, h.interval_days, h.done_at, h.care_schedule_id ?? null],
        );

        history.push(h);
      }

      // 10. re-agenda notificacoes (baseado nos cares)
      const now = dayjs();

      for (const care of cares) {
        if (!dayjs(care.next_due).isAfter(now)) continue;

        const plant = plants.find((p) => p.id === care.plant_id);
        if (!plant) continue;

        await this.notification.schedule({
          plant_id: care.plant_id,
          care_schedule_id: care.id,
          title: getNotificationTitle(care.type),
          body: getNotificationBody(plant.name, care.type),
          type: care.type,
          scheduled_for: care.next_due,
        });
      }

      const plantStore = usePlantStore.getState();
      const careStore = useCareStore.getState();
      const historyStore = useCareHistoryStore.getState();

      // Plants
      plantStore.setPlants(plants);

      // Notifications (já foram inseridas no schedule)
      await this.notification.getNotifications();

      // Cares agrupados por planta
      const caresByPlant = cares.reduce(
        (acc, care) => {
          if (!acc[care.plant_id]) acc[care.plant_id] = [];
          acc[care.plant_id].push(care);
          return acc;
        },
        {} as Record<number, Cares>,
      );

      plants.forEach((plant) => {
        careStore.setCares(plant.id, caresByPlant[plant.id] ?? []);
      });

      // History agrupado
      const historyByPlant = history.reduce(
        (acc, h) => {
          if (!acc[h.plant_id]) acc[h.plant_id] = [];
          acc[h.plant_id].push(h);
          return acc;
        },
        {} as Record<number, CaresHistory>,
      );

      plants.forEach((plant) => {
        historyStore.setHistory(plant.id, historyByPlant[plant.id] ?? []);
      });

      return true;
    } catch (error: any) {
      throw new Error(error.message || "Não foi possível importar os dados");
    }
  }

  private async pickDocument(): Promise<DocumentPicker.DocumentPickerAsset | null> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return null;
      }

      return result.assets[0];
    } catch (error: any) {
      throw new Error(error.message || "Não foi possível selecionar o arquivo");
    }
  }
}
