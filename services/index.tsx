import React from "react";

// Config
import { AiService } from "@/services/ai/ai.service";
import { CareService } from "@/services/care/care.service";
import { DatabaseService } from "@/services/database/database.service";
import { NotificationService } from "@/services/notification/notification.service";
import { OnboardingService } from "@/services/onboarding/onboarding.service";
import { PermissionService } from "@/services/permission/permission.service";
import { PlantService } from "@/services/plant/plant.service";
import { StorageService } from "@/services/storage/storage.service";

// Criar primeiro o ConfigService
const databaseService = new DatabaseService();
const permissionService = new PermissionService();
const onboardingService = new OnboardingService();
const aiService = new AiService();
const notificationService = new NotificationService(databaseService);
const storageService = new StorageService(databaseService, notificationService);
const careService = new CareService(databaseService, notificationService);
const plantService = new PlantService(databaseService, storageService, careService);

/**
 * @description Mapeia os serviços disponíveis na aplicação
 */
export const services = {
  notification: notificationService,
  database: databaseService,
  plant: plantService,
  care: careService,
  permission: permissionService,
  onboarding: onboardingService,
  storage: storageService,
  ai: aiService,
};

type ContextServices = typeof services;

/**
 * @description Contexto React para fornecer acesso aos serviços em toda a aplicação
 */
const ServicesContext = React.createContext<ContextServices>(services);
export const ServicesProvider = ({ children }: React.PropsWithChildren) => {
  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
};

/**
 * @description Hook para acessar o contexto dos serviços
 * @returns Retorna o contexto dos serviços
 */
export const useServices = (): ContextServices => React.useContext(ServicesContext);

/**
 * @description Inicializa todos os serviços registrados
 */
export const initServices = async (): Promise<void> => {
  // 1. Inicia as serviços
  await services.database.init();
  await services.notification.init();

  // 2. Limpa as notificações com mais de 3 meses
  await services.notification.cleanOldNotifications();

  // 3. Busca todas as notificações cadastradas e atualiza o estado na store
  await services.notification.getNotifications();

  // 4. Busca todas as plantas cadastradas, atualizando o estado na store e retornando as plantas para iteração
  const plants = await services.plant.getPlants();

  // 5. Lista os cuidados de cada planta para sincronização de UI (após listar as plantas)
  await Promise.all(
    plants.map(async (plant) => {
      await Promise.all([
        services.care.getCaresByPlant(plant.id), // Busca os cuidados da planta
        services.care.getHistoryByPlant(plant.id), // Busca o histórico de cuidados da planta
      ]);
    }),
  );
};
