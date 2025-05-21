// Updated SearchInput Component
"use client";
import React, { useRef, useState, useEffect } from "react";
import "./style.scss";
import { useClickAway } from "react-use";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useGetProductsQuery } from "@/app/redux-tookit/services/productService";

const Icon = dynamic(() => import("@iconify/react").then((mod) => mod.Icon), {
  ssr: false,
});

const SearchInput = () => {
  const [inputValue, setInputValue] = useState("");
  const [foc, setFoc] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [debouncedInput, setDebouncedInput] = useState("");
  const [previousPath, setPreviousPath] = useState(window.location.pathname);
  const router = useRouter();
  const searchRef = useRef(null);

  // Debounce input to reduce API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(inputValue.trim());
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  useEffect(() => {
    // const currentPath = localStorage.getItem("currentPath");
    // if(currentPath != '/products'){
    //   router.push(`./products`);
    // }
  }, []);

  const removeSearch = () => {
    setInputValue("");
    setDebouncedInput("");
    setIsFocused(false);
    // Redirect to the previous page
    if (previousPath) {
      router.push(previousPath);
    }
  };

  const { data, isLoading, isError } = useGetProductsQuery(debouncedInput);
  useEffect(() => {
    searchRef.current?.focus();
  }, [foc]);

  const handleInputClick = () => {
    const currentPath = localStorage.getItem("currentPath");
    console.log("currentPathcurrentPath", currentPath);
    if (currentPath != "/products") {
      router.push("./products");
      setFoc(true);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (!value.trim() && !previousPath) {
      setPreviousPath(window.location.pathname + window.location.search);
    }
    setInputValue(value);
    setIsFocused(!!value);
    if (value.trim()) {
      router.push(`./products?search=${encodeURIComponent(value)}`);
    }
  };

  const handleSelect = (value) => {
    setInputValue(value);
    setIsFocused(false);
  };

  useClickAway(searchRef, () => setIsFocused(false));

  const highlightText = (text, search) => {
    if (!text || !search) return text;

    const regex = new RegExp(`(${search})`, "gi");
    return (
      <span
        dangerouslySetInnerHTML={{
          __html: text.replace(regex, `<span class=\"highlight\">$1</span>`),
        }}
      />
    );
  };

  // Strict filtering to ensure only relevant suggestions
  const filteredResults = data?.results?.filter((item) =>
    item.title.toLowerCase().includes(debouncedInput.toLowerCase())
  );

  return (
    <div className="SearchInput">
      <div
        className="global_search"
        role="combobox"
        aria-expanded={isFocused}
        aria-controls="suggestions-list"
      >
        <input
          ref={searchRef}
          type="text"
          id="search"
          autoComplete="off"
          placeholder="Search Here..."
          value={inputValue}
          onChange={handleChange}
          onClick={() => handleInputClick()}
          onFocus={() => setIsFocused(true)}
          aria-autocomplete="list"
          aria-controls="suggestions-list"
        />
        <div className="search_icon cursor-pointer" onClick={removeSearch}>
          {inputValue ? (
            <Icon icon="carbon:close-outline" width="25" height="25" />
          ) : (
            <Icon icon="majesticons:search-line" width="25" height="25" />
          )}
        </div>
      </div>

      {/* {isFocused && inputValue.trim() !== "" && (
        <div
          className="suggestions_list customScrollbar"
          ref={searchRef}
          id="suggestions-list"
        >
          {isLoading && <h1 className="loading">Loading...</h1>}
          {isError && <h1 className="error">Please try other products</h1>}
          {!isLoading && !isError && (
            <ul role="listbox">
              {filteredResults?.length > 0
                ? filteredResults.map((item) => (
                    <li
                      key={item._id}
                      onClick={() => handleSelect(item.title)}
                      role="option"
                      aria-selected={isFocused}
                    >
                      <Icon icon="ri:search-line" width="20" height="20" />
                      {highlightText(item.title, debouncedInput)}
                    </li>
                  ))
                : debouncedInput.length > 1 && <li>No Products available</li>}
            </ul>
          )}
        </div>
      )} */}
    </div>
  );
};

export default SearchInput;
