"use strict";

const Joi = require("joi");
const Dao = require("../util/dao");
const uuid = require("uuid");

const payload_scheme = Joi.object({
	// productId: Joi.number().allow(null, "").optional(),
	title: Joi.string().allow(null, "").optional(),
	image: Joi.string().allow(null, "").optional(),
	price: Joi.number().allow(null, "").optional(),
	description: Joi.string().allow(null, "").optional(),
	// email: Joi.string().allow(null, "").optional(),
	// phone: Joi.string().allow(null, "").optional(),
	// quantity: Joi.number().allow(null, "").optional(),
	// address: Joi.string().allow(null, "").optional(),
	// price: Joi.number().allow(null, "").optional(),
});

const route_controller = {
	method: "POST",
	path: "/tours/add-tours",
	options: {
		description: "Add Tours",
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
		const checkTitle = await hasTitle(request);
		if (checkTitle > 0) {
			return h.response({
				status: false,
				code: 202,
				message: "Title has already been added",
			});
		}
		const data = await set_data(request);
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

const set_data = async (request) => {
	let oid = uuid.v4();
	let query = `INSERT INTO public.tours (oid,title,img,price,description)
    VALUES ('${oid}', '${request.payload.title}','${request.payload.image}', ${request.payload.price},'${request.payload.description}')`;

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

const hasTitle = async (request) => {
	let data = null;
	let oid = uuid.v4();
	let query = `Select * from public.tours t where t.title = $1`;

	let sql = {
		text: query,
		values: [request.payload.title],
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
