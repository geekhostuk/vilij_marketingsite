import { Module } from "@medusajs/framework/utils"
import ServiceEnquiryModuleService from "./service"

export const SERVICE_ENQUIRY_MODULE = "service_enquiry"

export default Module(SERVICE_ENQUIRY_MODULE, {
  service: ServiceEnquiryModuleService,
})
