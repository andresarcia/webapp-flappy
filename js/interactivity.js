 // just adding a comment
jQuery("#credits").on("dblclick",
                       function() { var message = "Game created by Morxa!";
                                    jQuery("#credits").append( "<p>" + message + "</p>" );});
jQuery("#credits").on("click",
          function() { var message = "Game created by Morxa!";
          jQuery("#credits").empty();});


jQuery("#scoresbtn").on("click", function() {
jQuery("#content").empty();
      jQuery("#content").append(
          "<ul>" +
              "<li>" + "Me" + "</li>" +
              "<li>" + "Also me" + "</li>" +
              "<li>" + "Me again" + "</li>" +
"</ul>" );
});

  jQuery("#creditsbtn").on("click", function() {
      jQuery("#content").empty();
      jQuery("#content").append(
          "<div>" + "Game created by Bob!" + "</div>"
      );
});

  jQuery("#helpbtn").on("click", function() {
      jQuery("#content").empty();
      jQuery("#content").append(
          "<ul>"
              + "<li>" + "Press SPACE to flap your wings" + "</li>"
              + "<li>" + "Avoid the incoming pipes" + "</li>"
+ "</ul>" );
});
