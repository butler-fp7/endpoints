module EndpointsHelper

	def editable?(endpoint)
		user_signed_in? && !endpoint.new_record? && endpoint.belongs_to?(current_user)
	end

	def css_method_class(endpoint)
		endpoint.get? ? 'info' : 'success'
	end

end
