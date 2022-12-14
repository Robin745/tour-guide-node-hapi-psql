"use strict";

const Joi = require("joi");
const Dao = require("../util/dao");

const payload_scheme = Joi.object({
	email: Joi.string().required(),
	password: Joi.string().required(),
});

const route_controller = {
	method: "POST",
	path: "/login",
	options: {
		description: "Check User",
		validate: {
			payload: payload_scheme,
			options: {
				allowUnknown: false,
			},
			failAction: async (request, h, err) => {
				return h
					.response({ code: 301, status: false, message: err?.message })
					.takeover();
			},
		},
	},
	handler: async (request, h) => {
		const data = await get_user_data(request);
		if (data) {
			return h.response(data);
		} else {
			return h.response({ code: 201, message: "Data not found" });
		}
	},
};

const get_user_data = async (request) => {
	let data = [];
	let query = `select * from public.users u where u.email = $1 
	and u.password = $2`;
	// and u.password = ${request.payload.password}

	// let query = `SELECT * from public.users (oid,uid,email,password)
	// VALUES ('${oid}','${request.payload.userId}', '${request.payload.email}', ${request.payload.password})`;

	let sql = {
		text: query,
		values: [request.payload.email, request.payload.password],
	};
	try {
		data = await Dao.get_data(request.pg, sql);
		return data[0];
	} catch (e) {
		console.log(
			`An exception occurred while getting issue list : ${e?.message}`
		);
	}
	return null;
};

module.exports = route_controller;
