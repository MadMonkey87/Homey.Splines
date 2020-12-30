Introduction
Provides an UI to create Splines and some flow cards to query it. 

Usage
 - Go to the app configuration and click on 'create'. Give the spline a name and setupo it's boundaries. Bellow you see a visual representation of the spline and you can also add/remove and modify the nodes. Bellow you find the exact values of the nodes.
 - If you would like to control the brightness of your lights trough the day you would setup multiple nodes like that: [0,50], [8,50], [9,100], [17,100] [18,50], [24,50] -> this would translate to 'until 8:00 set a brightness of 50%, until 9:00 gradually fade to 100%' and so on.
 - Create a trigger flow card 'Query a spline' or 'Query a spline (time based)' and select the desired spline
 - Create a second flow that used the 'Query completed' trigger card which contains the calculated position on the spline to set the brightness of your lights for example

 Examples
  - automatically apply the brightness or color temperature of your lights  during the day
  - fade in/out the volume of your speakers or the brightness of your lights with a custom pattern, i.e start slowly and accelerate at the end