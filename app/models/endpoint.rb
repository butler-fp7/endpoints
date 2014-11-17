class Endpoint < ActiveRecord::Base
	validates_presence_of :name, :url, :method, :description
	before_create { |e| e.public_id = Endpoint.generate_public_id }
	HTTP_VERB = %w(GET POST PUT)
	#scope :published, where(published: true)
	scope :published, -> { where(published: true) }
	paginates_per 10
	belongs_to :user

	def self.generate_public_id(length = 10)
		chars = ('a'..'z').to_a + ('A'..'Z').to_a + ('1'..'9').to_a
    	[('A'..'Z').to_a[rand(26)], Array.new(length-1) { chars[rand(chars.size)] }.join].join
	end

	def post?
		method == "POST"
	end

	def get? 
		method == "GET"
	end
	
	def belongs_to? u
		user_id.to_i == u.id.to_i
	end

	def to_param
		public_id
	end
	
end
