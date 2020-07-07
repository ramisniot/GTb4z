class ConfirmationsController < Devise::ConfirmationsController

  protected
    # The path used after confirmation.
    def after_confirmation_path_for(resource_name, resource)
      if signed_in?(resource_name)
        signed_in_root_path(resource)
      else
        user_email = resource.email
        set_password_path(em: user_email)
      end
    end
end