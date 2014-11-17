class ProxyController < ApplicationController
	include HTTParty
	debug_output $stderr
	
	def go
		method = params[:method]
		url = params[:url]
		headers = params[:headers]

		response = ProxyController.proxy(url, method, params[:parameters], params[:postBody], headers)
	
		respond_to do |format|
  		 format.json { render json: response.to_json }
		end
	end

	def self.proxy(url, method, parameters, body, headers)
		#options = { :body => parameters.to_json, :format => "json", :headers => headers}
		options = { :body => body, :format => "json", :headers => headers}
		HTTParty.send(method.downcase, *[url, options])
	end

end
