# Splines

Provides an UI to create splines and some flow cards to make use of it.

# Introduction
Splines are two dimensional functions that can be very helpful for your home automation with Homey. Basically you can assign Y values (i.e. brightness, volume,...) to an given X value (i.e. time). The spline will then interpolate between these nodes. This app provides an UI that allows you to easily create/edit splines and it's visual representation and provides some flow cards that you can use in your automations to make use of these splines.

# Usage
 - Go to the app configuration and click on 'create'. Give the spline a name and setup it's boundaries. Bellow you see a visual representation of the spline and you can also add/remove and modify the nodes. Bellow you find the exact values of the nodes.
 - If you would like to control the brightness of your lights trough the day you would setup multiple nodes like that: [0,50], [8,50], [9,100], [17,100] [18,50], [24,50] -> this would translate to 'until 8:00 set a brightness of 50%, until 9:00 gradually fade to 100%' and so on.
 - Create a trigger flow card 'Query a spline' or 'Query a spline (time based)' and select the desired spline
 - Create a second flow that used the 'Query completed' trigger card which contains the calculated position on the spline to set the brightness of your lights for example

# Alternative usage
 - It is now also possible to store the result of the spline calculation directly into a logic variable
 - Every spline calculation is now also available as a global token. In the 'when' part of the flow card add a 'Query a spline and wait for the result' condition. In the 'then' part you can use the flow token. Note: this might not be suitable if you use the same spline for different purposes as the drop token can only represent the latest calculation result.

 # Examples
  - Automatically apply the brightness or color temperature of your lights  during the day
  - Fade in/out the volume of your speakers or the brightness of your lights with a custom pattern, i.e. start slowly and accelerate at the end
