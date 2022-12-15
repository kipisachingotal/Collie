import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import {DataGrid} from "@mui/x-data-grid";
import QuickSearchToolbar from "./QuickSearchToolbar";

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function SearchableDataGrid({data, columns, selectedUsers, setSelectedUsers, type }) {
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState([...data.map(row => {return {name: row, id: data.indexOf(row)}})]);
  console.log(rows)
  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = data.filter((row) => {
      return searchRegex.test(row.toString());
    });
    setRows([...filteredRows.map(row => {return {name: row, id: data.indexOf(row)}})]);
  };


  useEffect(() => {
    setRows([...data.map(row => {return {name: row, id: data.indexOf(row)}})]);
  }, [data]);


  return (
    <div>
      <Box sx={{ height: 350, width: 1 }}>
        <DataGrid
          checkboxSelection
          components={{ Toolbar: QuickSearchToolbar }}
          rows={rows}
          columns={columns}
          componentsProps={{
            toolbar: {
              value: searchText,
              onChange: (event) => {
                requestSearch(event.target.value)
              },
              clearSearch: () => requestSearch(''),
            },
          }}
          rowsSelection={selectedUsers[type]}
          onSelectionModelChange={(ids) => {
            const selectedIds = new Set(ids);
            const users = rows.filter((row) => selectedIds.has(row.id));
            console.log(users);
            const newData = {}
            newData[type] = users;
            setSelectedUsers({...selectedIds, ...newData})
          }}
        />
      </Box>
    </div>
  );
}

export default SearchableDataGrid;