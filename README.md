# Browser-Machine-Learning-Gesture-Recognition
Node.js gesture recognition for the browser

### Development in progress

* [x] Create client for recognizing gestures.
* [x] Normalize gesture tracking for any viewport size.
* [x] Create server with socket for accepting gestures.
* [ ] Create training set for model using built client.
* [ ] Create and train model. 

### Overview
The purpose of this project is to demonstrate how an artificial neural network can be used to recognize gestures on webpages. The idea for this project was heavily inspired by Google’s Quick, Draw! game.
This concept provides client-side code for tracking mouse and touch based movements for both mobile and desktop. A swipe on the screen by either a finger or mouse is collected by the browser and sent to a Node.js server where it is classified/encoded to a specific set of gestures by a neural network. The current prototype is a proof of concept and will only be trained on four types of gestures (up, down, left, right). The current plan is to implement the neural network in Tensorflow.js.

### Training Set
I will be creating my own training set manually by creating a dummy client that will record swipes from my smartphone. I will then use this data to train the neural network via backpropogation.

The structure of the collected data will be:
```JSON
{
	"type":"right" // up, down, left, right
	"x":[] // the x coordinates of the swipe
	"y":[] // the y coordinates of the swipe
	// timestamp of swipe
}
```
