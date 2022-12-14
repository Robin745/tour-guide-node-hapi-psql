"use strict";

// const _ = require("underscore");
const Dao = require("../util/dao");

const route_controller = {
	method: "GET",
	path: "/users",
	handler: async (request, h) => {
		let s = await get_users_data(request);
		return h.response({ userData: s });
	},
};

const get_users_data = async (request) => {
	let data = [];
	let query = `select * from public.users`;

	// let query = `select * from public.tours t where t.oid = $1`;

	let sql = {
		text: query,
		values: [],
	};

	try {
		data = await Dao.get_data(request.pg, sql);
	} catch (e) {}
	return data;
};

module.exports = route_controller;
