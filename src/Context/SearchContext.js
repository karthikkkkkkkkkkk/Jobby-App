import React from 'react'

const SearchContext = React.createContext({
  searchInput: '',
  handleSearchInput: () => {},
})

export default SearchContext
