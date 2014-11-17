class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :omniauthable,
         :recoverable, :rememberable, :trackable, :validatable,
   	  	 :omniauthable, :omniauth_providers => [:google_oauth2]

  validates_presence_of :firstname, :lastname
  
  has_many :endpoints
    
  def self.find_for_google_oauth2(access_token, signed_in_resource=nil)
    data = access_token.info
    logger.debug data
    user = User.where(:email => data["email"]).first

    unless user
      user = User.create(firstname: data["first_name"], lastname: data["last_name"], email: data["email"], password: Devise.friendly_token[0,20])
    end
    user
  end

  def fullname
    [firstname, lastname].join(" ")
  end
end
