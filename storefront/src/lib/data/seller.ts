import { SellerProps } from '@/types/seller';

import { sdk } from '../config';

export const getSellerByHandle = async (handle: string) => {
  // Mercur v2.1.5 exposes sellers at `/store/sellers?handle=` (plural, filtered),
  // not `/store/seller/:handle`, and has no `reviews` relation — so we request
  // only the supported fields and default reviews to an empty list.
  return sdk.client
    .fetch<{ sellers: SellerProps[] }>(`/store/sellers`, {
      query: {
        handle,
        fields:
          'id,name,handle,description,logo,banner,metadata,created_at,*products,*products.variants'
      },
      cache: 'no-cache'
    })
    .then(({ sellers }) => {
      const seller = sellers?.[0];
      if (!seller) {
        return [] as unknown as SellerProps;
      }
      return { ...seller, reviews: [] } as SellerProps;
    })
    .catch(() => []);
};
