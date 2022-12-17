"use strict";

const Joi = require("joi");
const Dao = require("../util/dao");

const payload_scheme = Joi.object({
	oid: Joi.string().allow(null, "").optional(),
	title: Joi.string().allow(null, "").optional(),
	img: Joi.string().allow(null, "").optional(),
	price: Joi.number().allow(null, "").optional(),
	added_at: Joi.string().allow(null, "").optional(),
	description: Joi.string().allow(null, "").optional(),
	// email: Joi.string().allow(null, "").optional(),
	// phone: Joi.string().allow(null, "").optional(),
	// quantity: Joi.number().allow(null, "").optional(),
	// address: Joi.string().allow(null, "").optional(),
	// price: Joi.number().allow(null, "").optional(),
});

const route_controller = {
	method: "POST",
	path: "/tours/add-to-cart",
	options: {
		description: "Add To Cart",
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
				message: "Already In Cart",
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
			message: "Added To cart",
		});
	},
};

const set_data = async (request) => {
	let query = `INSERT INTO public.cart (oid,title,img,price,description)
    VALUES ('${request.payload.oid}', '${request.payload.title}','${request.payload.img}', ${request.payload.price},'${request.payload.description}')`;

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
	let query = `Select * from public.cart t where t.title = $1`;

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
