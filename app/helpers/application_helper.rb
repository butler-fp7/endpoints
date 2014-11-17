module ApplicationHelper

	# def input_wrapper name
	# 	content_tag(:div, class: "form-group") do 
	# 		concat(content_tag(:label, class: "col-sm-2.control-label") do
	# 			name
	# 		end)
	# 		concat(yield)
	# 	end

	# end

	def input_wrapper name, required, help_text = ""
		content_tag(:div, class: "form-group #{'required' if required == true}") do 
			concat(content_tag(:label, class: "col-sm-2 control-label") do
				name
			end)
			concat(content_tag(:div, class: "col-sm-10") do
				yield
				concat(content_tag(:p, class: "help-block") do
					help_text
			end) unless help_text.blank?

			end)
		end

	end

	def icon(name, text = "")
    	content_tag(:span, class: "glyphicon glyphicon-#{name}") {} + "&nbsp;#{text}".html_safe
	end

	def title t, hide_h1 = false
	    content_for :title, t
	    content_tag(:h1, t) unless hide_h1
  	end

  def bootstrap_class_for(flash_type)
    case flash_type
      when "success"
        "alert-success"   # Green
      when "error"
        "alert-danger"    # Red
      when "alert"
        "alert-warning"   # Yellow
      when "notice"
        "alert-info"      # Blue
      else
        flash_type.to_s
    end
  end

end
