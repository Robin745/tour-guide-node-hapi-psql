"use strict";

const Joi = require("joi");
const Dao = require("../util/dao");
const uuid = require("uuid");

const payload_scheme = Joi.object({
	name: Joi.string().allow(null, "").optional(),
	email: Joi.string().allow(null, "").optional(),
	password: Joi.string().allow(null, "").optional(),
	confirmPassword: Joi.string().allow(null, "").optional(),
	// description: Joi.string().allow(null, "").optional(),
	// email: Joi.string().allow(null, "").optional(),
	// phone: Joi.string().allow(null, "").optional(),
});

const route_controller = {
	method: "POST",
	path: "/users/add",
	options: {
		description: "Add User",
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
		const checkTitle = await hasEmail(request);
		if (checkTitle > 0) {
			return h.response({
				status: false,
				code: 202,
				message: "Email has already been added",
			});
		}
		const data = await set_user(request);
		if (!data) {
			return h.response({
				status: false,
				code: 201,
				message: "Something is wrong",
			});
		}

		return h.response({
			status: true,
			code: 200,
			message: "Data has been inserted successfully",
		});
	},
};

const set_user = async (request) => {
	let oid = uuid.v4();
	let role = "user";
	let query = `INSERT INTO public.users (oid,email,password,name,role)
    VALUES ('${oid}', '${request.payload.email}','${request.payload.password}','${request.payload.name}','${role}')`;

	let sql = {
		text: query,
		values: [],
	};
	try {
		await Dao.execute_value(request.pg, sql);
		return true;
	} catch (e) {
		console.log(
			`An exception occurred while getting issue list : ${e?.message}`
		);
		return false;
	}
};

const hasEmail = async (request) => {
	let data = null;
	let query = `Select * from public.users t where t.email = $1`;

	let sql = {
		text: query,
		values: [request.payload.email],
	};
	try {
		data = await Dao.get_data(request.pg, sql);
		return data.length;
	} catch (e) {
		console.log(
			`An exception occurred while getting issue list : ${e?.message}`
		);
	}
	return 0;
};

module.exports = route_controller;
