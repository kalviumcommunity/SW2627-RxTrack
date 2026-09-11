import { pharmacyRepository } from "../repositories/pharmacy.repository";
import { userRepository } from "../repositories/user.repository";
import type { RequestActor } from "../types/prescription";
import type { UpdatePharmacyInput } from "../validators/pharmacy.validator";

export const pharmacyService = {
  list() {
    return pharmacyRepository.findAll();
  },

  async resolveOrCreateForUser(actor: RequestActor) {
    const existing = await pharmacyRepository.findByUserId(actor.id);
    if (existing) return existing;

    const user = await userRepository.findById(actor.id);
    return pharmacyRepository.create({
      userId: actor.id,
      name: user?.name ?? "Unnamed Pharmacy",
    });
  },

  getMine(actor: RequestActor) {
    return this.resolveOrCreateForUser(actor);
  },

  async updateMine(actor: RequestActor, input: UpdatePharmacyInput) {
    const pharmacy = await this.resolveOrCreateForUser(actor);
    return pharmacyRepository.update(pharmacy.id, input);
  },
};