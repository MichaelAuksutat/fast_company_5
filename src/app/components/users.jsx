import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { paginate } from "../utils/paginate";
import Pagination from "./pagination";
import User from "./user";
import GroupList from "./groupList";
import api from "../api";
import SearchStatus from "./searchStatus";

const Users = ({ users: allUsers, ...rest }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [professions, setProfession] = useState();
    const [qualities, setQualities] = useState();
    const [selectProf, setSelectedProf] = useState();
    const [selectQuality, setSelectedQuality] = useState();

    const pageSize = 4;
    useEffect(() => {
        api.professions.fetchAll().then((data) => setProfession(data));
        api.qualities.fetchAll().then((data) => setQualities(data));
    }, []);
    useEffect(() => {
        setCurrentPage(1);
    }, [selectProf]);

    const handeleProfessionSelect = (item) => {
        setSelectedProf(item);
        selectQuality();
    };
    const handeleQualitySelect = (item) => {
        setSelectedQuality(item);
    };
    const handlePageChange = (pageIndex) => {
        setCurrentPage(pageIndex);
    };

    // const fileredUsers = selectProf
    //     ? allUsers.filter(user => (user.profession._id === selectProf._id) && (user.profession.name === selectProf.name))
    //     : allUsers;

    function checkQuality(user, checkquality) {
        return (user.qualities.filter(quality => quality.name === checkquality.name).length > 0);
    }
    function getFilteredUsers() {
        let users = allUsers;
        if (selectProf) {
            users = users.filter(user => (user.profession._id === selectProf._id) && (user.profession.name === selectProf.name));
        };
        if (selectQuality) {
            users = users.filter(user => checkQuality(user, selectQuality));
        };
        return users;
    };
    const fileredUsers = getFilteredUsers();
    const count = fileredUsers.length;
    const usersCrop = paginate(fileredUsers, currentPage, pageSize);
    const clearProfessionFilter = () => {
        setSelectedProf();
    };
    const clearQualityFilter = () => {
        setSelectedQuality();
    };
    return (
        <div className="d-flex">
            {professions && (
                <div className="d-flex flex-column flex-shrink-0 p-3">
                    <GroupList
                        selectedItem={selectProf}
                        items={professions}

                        onItemSelect={handeleProfessionSelect}
                    />

                    <button
                        className="btn btn-secondary mt-2"
                        onClick={clearProfessionFilter}
                    >
                        {" "}
                        Очистить
                    </button>
                </div>
            )}
            {qualities && (
                <div className="d-flex flex-column flex-shrink-0 p-3">
                    <GroupList
                        selectedItem={selectQuality}
                        items={qualities}

                        onItemSelect={handeleQualitySelect}
                    />

                    <button
                        className="btn btn-secondary mt-2"
                        onClick={clearQualityFilter}
                    >
                        {" "}
                        Очистить
                    </button>
                </div>
            )}
            <div className="d-flex flex-column">
                <SearchStatus length={count} />

                {count > 0 && (
                    <table className="table ">
                        <thead>
                            <tr>
                                <th scope="col">Имя</th>
                                <th scope="col">Качества</th>
                                <th scope="col">Провфессия</th>
                                <th scope="col">Встретился, раз</th>
                                <th scope="col">Оценка</th>
                                <th scope="col">Избранное</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {usersCrop.map((user) => (
                                <User {...rest} {...user} key={user._id} />
                            ))}
                        </tbody>
                    </table>
                )}
                <div className="d-flex justify-content-center">
                    <Pagination
                        itemsCount={count}
                        pageSize={pageSize}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
};

Users.propTypes = {
    users: PropTypes.array
};

export default Users;
