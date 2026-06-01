import { Module } from "@medusajs/framework/utils"
import HomepageSlotsModuleService from "./service"

export const HOMEPAGE_SLOTS_MODULE = "homepage_slots"

export default Module(HOMEPAGE_SLOTS_MODULE, {
  service: HomepageSlotsModuleService,
})
