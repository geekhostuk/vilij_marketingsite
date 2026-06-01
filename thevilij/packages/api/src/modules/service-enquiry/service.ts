import { MedusaService } from "@medusajs/framework/utils"
import ServiceEnquiry from "./models/service-enquiry"

class ServiceEnquiryModuleService extends MedusaService({
  ServiceEnquiry,
}) {}

export default ServiceEnquiryModuleService
