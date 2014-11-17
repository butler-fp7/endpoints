module DeviseHelper

  # from http://www.jacopretorius.net/2014/03/adding-custom-fields-to-your-devise-user-model-in-rails-4.html
  def devise_error_messages!
    return '' if resource.errors.empty?

    messages = resource.errors.full_messages.map { |msg| content_tag(:li, msg) }.join
    sentence = I18n.t('errors.messages.not_saved',
      count: resource.errors.count,
      resource: resource.class.model_name.human.downcase)

	html = <<-HTML
    	<div class="alert alert-danger">
      	<strong>#{sentence}</strong>
      	<ul>
       	 #{messages}
      	</ul>
    	</div>
	HTML


    html.html_safe
  end
end