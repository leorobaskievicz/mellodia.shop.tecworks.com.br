"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Pagination } from "@mui/material";
import { styleContainerBody } from "./style";

export default function Paginacao({ page, perPage, lastPage }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChangePage = (event, value) => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("page", value);
    window.history.pushState({}, "", `${window.location.pathname}?${currentParams.toString()}`);
    window.location.reload();
    // router.push(`${window.location.pathname}?${currentParams.toString()}`);
  };

  return <Pagination count={lastPage} page={page} onChange={handleChangePage} color="primary" showFirstButton showLastButton />;
}
