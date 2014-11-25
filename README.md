Endpoints
=========

Endpoints is a web application that aims at documenting web services. Basically, through a simple web interface, it gives developers a tool to describe their API, by providing the endpoint and the parameters to be sent in the request. It is documented on the [Open Platforms website](http://open-platforms.eu/library/endpoints/).

See it in action: http://endpoints.open-platforms.eu/.

Endpoints has been mainly developed with the following stack:

* Ruby (2.1.0)
* Ruby on Rails (4.1.0)
* MySQL 
* jQuery
* [Devise](https://github.com/plataformatec/devise)
* [Omniauth](https://github.com/intridea/omniauth)
* [httparty](https://github.com/jnunemaker/httparty)
* [omniauth-google-oauth2](https://github.com/zquestz/omniauth-google-oauth2)
* [kaminari](https://github.com/amatsuda/kaminari)
* [Bootstrap](http://getbootstrap.com/) (v2.3.1)
* [rails-settings-cached](https://github.com/huacnlee/rails-settings-cached)

## Installation

* Install required gems with `bundle install`
* Create a database and configure the `database.yml` configuration file
* Run migrations `bundle exec rake db:migrate`
* Start the server `bundle exec rails s`
* Open a web browser and visit [http://localhost:3000](http://localhost:3000)

### Google OAuth2

Users can be authentified through their Google account. This is made possible thanks to the [Devise](https://github.com/plataformatec/devise), [Omniauth](https://github.com/intridea/omniauth) and [omniauth-google-oauth2](https://github.com/zquestz/omniauth-google-oauth2) gems. In order to enable the Google OAuth2 authentification, OAuth 2.0 credentials (client ID and client secret) have to be requested on the [Google Developers Console](https://console.developers.google.com/).

## Deployment

The endpoints app can be deployed through [Capistrano](https://github.com/capistrano/capistrano). The `deploy.rb` file located in the config folder needs to be customized. 

### Google Analytics (or other analytics app)

The Google Analytics tracking code can be inserted on every page. It has to be set as a setting ([rails-settings-cached](https://github.com/huacnlee/rails-settings-cached)) stored in the database. To setup the tracking code, fire a console (`bundle exec rails c`) and set the code with the following command:
`Settings.google_analytics_tracking_code = "<script> YOUR_TRACKING_CODE_HERE </script>"`
Please note that this works with any tracking code. 

## Screenshots

![Edit an endpoint](https://raw.githubusercontent.com/butler-fp7/endpoints/master/screnshots/endpoints_edit1.png)
![Export an endpoint](https://raw.githubusercontent.com/butler-fp7/endpoints/master/screnshots/endpoints_export1.png)
![List](https://raw.githubusercontent.com/butler-fp7/endpoints/master/screnshots/endpoints_list1.png)
![Use an endpoint](https://raw.githubusercontent.com/butler-fp7/endpoints/master/screnshots/endpoints_test_11.png)
![Use an endpoint](https://raw.githubusercontent.com/butler-fp7/endpoints/master/screnshots/endpoints_test_21.png)

## Todo 

* Tests

## Contact

[Fabrice Clari](mailto:f.clari@inno-group.com) ([inno TSD](http://www.inno-group.com))

## Licence

The endpoints app is released under the [MIT License](http://opensource.org/licenses/MIT).

