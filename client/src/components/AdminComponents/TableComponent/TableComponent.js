import { useMemo } from 'react';
import { useTable } from 'react-table';

// import './TableComponent.css';
import styles from './TableComponent.module.css';

const TableComponent = ({ dataToPrint, formatColumn }) => {
	const columns = useMemo(() => formatColumn, []);
	const data = useMemo(() => dataToPrint, [dataToPrint]);
	const tableInstance = useTable({
		columns,
		data
	});

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		rows
	} = tableInstance;

	return (
		<div className={styles.tableWrapper}>
			<table {...getTableProps()} className={styles.tableComponentEcommerce}>
				<thead>
					{headerGroups.map(headerGroup => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map(column => (
								<th {...column.getHeaderProps()}>{column.render('Header')}</th>
							))}
						</tr>
					))}
				</thead>
				<tbody {...getTableBodyProps()}>
					{rows.map(row => {
						prepareRow(row);
						return (
							<tr {...row.getRowProps()}>
								{row.cells.map(cell => {
									return (
										<td
											data-label={`${cell.column.Header}`}
											{...cell.getCellProps()}
										>
											{cell.render('Cell')}
										</td>
									);
								})}
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default TableComponent;
