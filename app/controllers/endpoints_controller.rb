class EndpointsController < ApplicationController

	before_action :authenticate_user!, except: [:show, :index, :about]
	helper_method :show_all_endpoints?

	def new
		@endpoint = Endpoint.new
	end

	def show
		@endpoint = Endpoint.find_by_public_id(params[:id])
		if params[:type] == :widget
		 	render layout: 'widget' 
		 	# response.headers['X-Frame-Options'] = 'ALLOW-FROM http://open.iot-butler.eu'
		 	# response.headers["X-FRAME-OPTIONS"] = "ALLOW-FROM http://example.com"
		 	response.headers.delete "X-Frame-Options"
		end
		
	end

	def edit
		@endpoint = current_user.endpoints.find_by_public_id(params[:id])
	end

	def create
		@endpoint = current_user.endpoints.new endpoint_params
		if @endpoint.save
			redirect_to edit_endpoint_path(@endpoint), notice: "Endpoint created."
		else
			render :new
		end
	end

	def update
		@endpoint = current_user.endpoints.find_by_public_id(params[:id])
		if @endpoint.update_attributes endpoint_params
			redirect_to edit_endpoint_path(@endpoint), notice: "Endpoint updated."
		else
			render :edit
		end
		
	end

	def endpoint_params
  		params.require(:endpoint).permit(:name, :description, :url, :method, :parameters, :headers, :show_body, :post_body, :published)

  	end

  	def index
  		@show_all = params[:type] != :account
  		@endpoints =  @show_all == true ? Endpoint.published.order(:name).page(params[:page]) : current_user.endpoints.order(:name).page(params[:page])
  	end

  	def destroy
  		@endpoint = current_user.endpoints.find_by_public_id params[:id]
  		@endpoint.destroy
  		redirect_to account_endpoints_path, notice: "The endpoint entry has been successfully deleted."
	end

	def show_all_endpoints?
		@show_all
	end

end
