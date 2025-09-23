import React from "react";
import HeaderOne from "../components/HeaderOne";
import FooterAreaOne from "../components/FooterAreaOne";
import Breadcrumb from "../components/Breadcrumb";
import { useLocation } from "react-router-dom";
import SearchResults from "../components/SearchResults";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchPage = () => {
  const query = useQuery();
  const searchTerm = query.get("q") || "";

  return (
    <>
    {/* Header one */}
      <HeaderOne />

      {/* Breadcrumb */}
      <Breadcrumb title={"Search"} />

      <SearchResults searchTerm={searchTerm} />
       <FooterAreaOne />
    </>
  );
};

export default SearchPage;
