import React, { useState, useEffect } from 'react';
import useStyles from './style';
import { Alert } from 'components';
import {
	Button, Card
} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import AddIcon from '@material-ui/icons/Add';
import { Breadcrumb } from 'components';
import { SortTable, SingleSelect, DeleteModal } from './components';
import training from '../../apis/training';

import EXCEL from 'js-export-xlsx';

const Trainings = props => {
	const { history } = props;
	const [sortOption, setSortOption] = useState({ sortBy: 0, sortOrder: "asc" });
	const [countList, setCountList] = useState([25, 50, 100]);
	const [selectedCount, setSelectedCount] = useState(25);
	const [page, setPage] = useState(1);
	const [data, setData] = useState([]);
	const [total, setTotal] = useState(0);
	const [searchId, setSearchId] = useState('');
	const [searchName, setSearchName] = useState('');
	const [searchParticipant, setSearchParticipant] = useState(0);
	const [participantList, setParticipantList] = useState([]);
	const [searchTrainingStatus, setSearchTrainingStatus] = useState(0);
	const [trainingStatusList, setTrainingStatusList] = useState([{ id: 1, name: 'TAK' }, { id: 2, name: 'NIE' }]);
	const [searchScheduleDate, setSearchScheduleDate] = useState(null);
	const [openModal, setOpenModal] = useState(false);
	const [selectedItem, setSelectedItem] = useState(-1);
	const classes = useStyles();
	const breadcrumbs = [{ active: true, label: 'Usługi', href: '/service_list' }, { active: false, label: 'Szkolenia' }];
	const [hasAlert, setHasAlert] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [message, setMessage] = useState('');
	const [progressStatus, setProgressStatus] = useState(false);


	useEffect(() => {
		training.getInfo()
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setParticipantList(response.data.participant);
				}
			})
		handleSearch();
	}, []);

	useEffect(() => {
		handleSearch();
	}, [sortOption, page]);

	useEffect(() => {
		handleSearch();
		setPage(1);
	}, [selectedCount, searchId, searchName, searchParticipant, searchTrainingStatus, searchScheduleDate]);

	const requestSort = (pSortBy) => {
		var sortOrder = "asc";
		if (pSortBy === sortOption.sortBy) {
			sortOrder = (sortOption.sortOrder === "asc" ? "desc" : "asc");
		}
		setSortOption({ sortBy: pSortBy, sortOrder: sortOrder })
	}

	const getDate = (date) => {
		if (date === null || date.length === 0)
			return '';
		let _date = new Date(date);
		return _date.getFullYear() + '-' + (_date.getMonth() + 1 < 10 ? '0' + (_date.getMonth() + 1) : (_date.getMonth() + 1)) + '-' + (_date.getDate() < 10 ? '0' + _date.getDate() : _date.getDate());
	}

	const handleSearch = () => {
		training
			.getListByOption(sortOption.sortBy, sortOption.sortOrder, selectedCount, page, searchId, searchName, searchParticipant, searchTrainingStatus, getDate(searchScheduleDate))
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					if (response.code === 200) {
						setData(response.data.trainings);
						setTotal(response.data.count);
					}
				}
			})
	}

	const handleCreate = () => {
		history.push('/trainings/create');
	}

	const getParticipantStr = (str) => {
		if (!participantList || participantList.length == 0)
			return '';
		if (str == null)
			str = '';
		let list = str.split(',');
		let res_list = [];
		list.map((item, index) => {
			for (let i = 0; i < participantList.length; i++) {
				if (parseInt(item) === parseInt(participantList[i].id)) {
					res_list.push(participantList[i].name);
				}
			}

		});
		return res_list.join(', ');
	}

	const handleExport = () => {
		training
			.getListByOption(sortOption.sortBy, sortOption.sortOrder, total, page, searchId, searchName, searchParticipant, searchTrainingStatus, getDate(searchScheduleDate))
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					if (response.code === 200) {
						let _data = response.data.trainings;
						let export_data = [];
						for (let i = 0; i < _data.length; i++) {
							let item = [];
							item.push(_data[i].id);
							item.push(_data[i].name);
							item.push(getParticipantStr(_data[i].participant));
							item.push(trainingStatusList[_data[i].training_status - 1].name);
							let _date = new Date(_data[i].date);
							item.push(_date.getDate() + '.' + (_date.getMonth() + 1) + '.' + _date.getFullYear() + ' ' + _date.getHours() + ':' + _date.getMinutes());
							export_data.push(item);
						}

						EXCEL.outPut({
							header: ['ID', 'Nazwa', 'Zaipisani uczestnicy', 'Zaakceptowane', 'Data rozpoczęcia'],
							data: export_data,
							name: 'download'
						})
					}
				}
			})

	}

	const handleSelectedItem = (id) => {
		setSelectedItem(id);
		setOpenModal(true);
	}

	const handleCloseModal = () => {
		setOpenModal(false);
	}

	const handleDelete = () => {

		setProgressStatus(true);
		training
			.delete(selectedItem)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					if (response.code === 200) {
						setHasAlert(true);
						setMessage(response.message);
						setIsSuccess(response.code === 200);
					}
					setProgressStatus(false);
					handleSearch();
					setPage(1);
				}
			})
	}

	const handlePaginationLabel = (type, page, selected) => {
		if (type === 'first') {
			return 'Przejdź do pierwszej strony'
		}
		if (type === 'previous') {
			return 'Wróć do poprzedniej strony';
		}
		if (type === 'next') {
			return 'Przejdź do następnej strony';
		}
		if (type === 'last') {
			return 'Przejdź do ostatniej strony';
		}
		return `Strona ${page}`;
	}

	return (
		<div className={classes.public}>
			<div className={classes.controlBlock}>
				<Button variant="contained" color="secondary" id="main" className={classes.btnCreate} onClick={handleCreate}>
					<AddIcon style={{ marginRight: '20px' }} />
          Dodaj szkolenie
        </Button>
				<Button title="wielkość pliku poniżej 1 megabajt" variant="outlined" color="secondary" className={classes.btnExport} onClick={handleExport}>
					Eksport listy do XLS
        </Button>
			</div>
			<div className={classes.divide} />
			<div className={classes.filter}>
				<Breadcrumb list={breadcrumbs} />
				<div className={classes.rowsBlock}>
					<div>Pokaż:</div>
					<SingleSelect value={selectedCount} handleChange={setSelectedCount} list={countList} />
					<div>pozycji</div>
				</div>
			</div>
			<Alert
				hasAlert={hasAlert}
				setHasAlert={setHasAlert}
				isSuccess={isSuccess}
				message={message}
			/>
			<Card className={classes.table}>
				<SortTable
					rows={data}
					requestSort={requestSort}
					sortOrder={sortOption.sortOrder}
					sortBy={sortOption.sortBy}
					total={total}
					page={page}
					selectedCount={selectedCount}
					searchId={searchId}
					setSearchId={setSearchId}
					searchName={searchName}
					setSearchName={setSearchName}
					searchParticipant={searchParticipant}
					setSearchParticipant={setSearchParticipant}
					participantList={participantList}
					searchTrainingStatus={searchTrainingStatus}
					setSearchTrainingStatus={setSearchTrainingStatus}
					trainingStatusList={trainingStatusList}
					searchScheduleDate={searchScheduleDate}
					setSearchScheduleDate={setSearchScheduleDate}
					handleDelete={handleSelectedItem}
				/>
				{
					total > selectedCount &&
					<div className={classes.pagination}>
						<Pagination
							className={classes.pagenation_class}
							count={total % selectedCount == 0 ? total / selectedCount : parseInt(total / selectedCount) + 1}
							onChange={(e, page) => { setPage(page) }}
							page={page}
							getItemAriaLabel={handlePaginationLabel}
							showFirstButton
							showLastButton
							aria-label="Przejdź do następnych stron wyników wyszukiwania wybierając intersująca cię stronę" />
					</div>
				}
			</Card>
			<DeleteModal
				openModal={openModal}
				handleClose={handleCloseModal}
				handleDelete={handleDelete}
				selectedIndex={selectedItem}
			/>
		</div>
	);
};

export default Trainings;
