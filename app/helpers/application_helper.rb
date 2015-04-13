module ApplicationHelper

  def on_page path
    css_class = 'inactive'
    css_class = 'active' if current_page?(path)
    css_class
  end

end
