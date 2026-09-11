import { medicineRepository } from "../repositories/medicine.repository";

export const medicineService = {
  list(search?: string) {
    return medicineRepository.findAll(search);
  },
};