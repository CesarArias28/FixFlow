import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();
	const navigate = useNavigate();
	const handleLogout = () => {
		localStorage.clear();
		dispatch({ type: "logout" });
		navigate("/login");
	};