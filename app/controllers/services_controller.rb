class ServicesController < ApplicationController

	skip_before_action :verify_authenticity_token

	def add
		render json: {x: params[:x].to_i, y: params[:y].to_i, sum: (params[:x].to_i + params[:y].to_i).to_i}
	end

	# tmp to test notifications from the SmartThings cloud engine
	def smartthings
		render text: "ok :-)"
	end

end
