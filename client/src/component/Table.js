import React, { useState,useEffect } from "react";

import { useTable, usePagination, useRowSelect} from 'react-table'
import 'bootstrap/dist/css/bootstrap.min.css';
const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
        const defaultRef = React.useRef()
        const resolvedRef = ref || defaultRef

        React.useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate
        }, [resolvedRef, indeterminate])

        return (
            <>
                <input type="checkbox" ref={resolvedRef} {...rest} />
            </>
        )
    }
)


function Table({ columns, data }) {
    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        gotoPage,
        pageCount,
        canPreviousPage,
        canNextPage,
        pageOptions,
        nextPage,
        previousPage,
        setPageSize,

        state: { pageIndex, pageSize, selectedRowIds },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 30 },
        },
        usePagination,
        useRowSelect,

        hooks => {
            hooks.visibleColumns.push(columns => [
                // Let's make a column for selection
                {
                    id: 'selection',
                    // The header can use the table's getToggleAllRowsSelectedProps method
                    // to render a checkbox
                    Header: ({ getToggleAllPageRowsSelectedProps }) => (
                        <div>
                            <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
                        </div>
                    ),
                    // The cell can use the individual row's getToggleRowSelectedProps method
                    // to the render a checkbox
                    Cell: ({ row }) => (
                        <div>
                            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                        </div>
                    ),
                },
                ...columns,
            ])
        }
    )

    // Render the UI for your table
    return (
        <div className = "container">
            <table className="table" {...getTableProps()}>
                <thead className="App-header">
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="table-body" {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row)
                        return (
                            <tr className="table-row" {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            
            <ul className="pagination">
                <li className="page-item" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    <button>{'<<'}</button>
                </li>{'   '}
                
                <li className="page-item" onClick={() => previousPage()} disabled={!canPreviousPage}>
                    <button>{'<'}</button>
                </li>{'   '}

                <li className="page-item" onClick={() => nextPage()} disabled={!canNextPage}>
                    <button>{'>'}</button>
                </li>{'   '}
                <li className="page-item" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    <button>{'>>'}</button>
                </li>{'   '}

                <li className="page-item">
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '}
                </li>
                <select
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value))
                    }}
                    style={{ width: '50px', height: '38px' }}
                >
                    {[ 30, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            {pageSize}
                        </option>
                    ))}
                </select>
            </ul>
        </div >
    )
}

function PaginationTable() {
    const columns = React.useMemo(
        () => [
            {
                Header: 'NETFLIX  POPULAR SHOWS AND MOVIES',
                columns: [
                    {
                        Header: 'SHOW ID',
                        accessor: 'show_id'
                    },
                    {
                        Header: 'TITLE',
                        accessor: 'title'
                    },
                    {
                        Header: 'DIRECTOR',
                        accessor: 'director'
                    },
                    {
                        Header: 'COUNTRY',
                        accessor: 'country'
                    },
                    {
                        Header: 'RELEASE YEAR',
                        accessor: 'release_year'
                    },
                    {
                        Header: 'DURATION',
                        accessor: 'duration'
                    }
                ],
            }
        ],
        []
    )
    const [data, setData] = useState([]);
    useEffect(() => {
        fetch('http://localhost:5000/contents')
        .then(response => response.json())
        .then(json => setData(json))
    }, [])
    return (
        <Table columns={columns} data={data} />
    )
}

export default PaginationTable;