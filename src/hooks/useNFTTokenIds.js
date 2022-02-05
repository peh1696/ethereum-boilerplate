import { ContactsOutlined } from "@ant-design/icons";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useEffect, useState } from "react";
import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import { useIPFS } from "./useIPFS";
import { useMoralis } from "react-moralis";
import { useMemo } from "react";

export const useNFTTokenIds = (addr, limit = 100) => {
  const { token } = useMoralisWeb3Api();
  const { chainId } = useMoralis();
  const { resolveLink } = useIPFS();
  const getAllTokenIdsOpts = {
      chain: chainId,
      address: "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",//addr,
      limit: limit,
  };

  const {
      fetch: getNFTTokenIds,
      data,
      error,
      isLoading,
      isFetching,
  } = useMoralisWeb3ApiCall(
      token.getAllTokenIds,
      getAllTokenIdsOpts,
      { autoFetch: !!token && addr !== "explore" },
  );

  const NFTTokenIds = useMemo(() => {
      console.log('fetching tokenIds data')
      if (!data?.result || !data?.result.length) {
          return data;
      }
      const formattedResult = data.result.map((nft) => {
          try {
              if (nft.metadata) {
                  const metadata = JSON.parse(nft.metadata);
                  const image = resolveLink(metadata?.image);
                  return { ...nft, image, metadata };
              }
          } catch (error) {
              return nft;
          }
          return nft;
      });

      return { ...data, result: formattedResult };
  }, [data]);

  return { getNFTTokenIds, data: NFTTokenIds, error, isLoading, isFetching };
};
