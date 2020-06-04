class UserMailer < ActionMailer::Base
    default :from => "rami@byte4za.com"

 def registration_confirmation(user)
    @user = user
    mail(:to => "#{user.first_name} #{user.last_name} <#{user.email}>", :subject => "Registration Confirmation")
 end
end 