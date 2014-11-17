require 'bundler/capistrano'


set :application, "endpoints"
set :repository,  "git@github.com:butler-fp7/endpoints.git"
set :normalize_asset_timestamps, false

set :scm, :git
set :branch, "master"

set :user, "cap"
set :use_sudo, false

set :host, "195.154.232.243"

ssh_options[:forward_agent] = true
set :deploy_via, :remote_cache

set :deploy_to, "/var/www/#{application}"

set :rails_env, :production

server host, :app, :web, :db, :primary => true

namespace :deploy do
  task :restart do
    run "touch #{current_path}/tmp/restart.txt"
  end
end

desc "tail log files"
task :tail, :roles => :app do
  run "tail -f #{shared_path}/log/#{rails_env}.log" do |channel, stream, data|
    puts "#{channel[:host]}: #{data}"
    break if stream == :err
  end
end





