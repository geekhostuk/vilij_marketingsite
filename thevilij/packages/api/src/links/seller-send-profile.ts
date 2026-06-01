import { defineLink } from "@medusajs/framework/utils"
import SellerModule from "@mercurjs/core/modules/seller"
import SendSellerProfileModule from "../modules/send-seller-profile"

/**
 * 1:1 link between a Mercur Seller and The Vilij's SEND profile, so we can attach
 * SEND fields, founding state and badges without modifying the Mercur seller model.
 */
export default defineLink(
  SellerModule.linkable.seller,
  SendSellerProfileModule.linkable.sendSellerProfile
)
