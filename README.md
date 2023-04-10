[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/p8OnGkdQ)
[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-8d59dc4de5201274e310e4c54b9627a8934c3b88527886e3b421487c677d23eb.svg)](https://classroom.github.com/a/p8OnGkdQ)
# Homework #5: Argumentative Vis

In this homework, you will create a pair of data visualizations that argue for opposing viewpoints, using the same base dataset.

Your completed submission should include the following files:
* `index.html`: The webpage with the visualizations.
* `data/`: The folder containing your dataset file(s).
* Any other necessary files like CSS, JS, etc.

(If your dataset is larger than 10 MB, please only extract the portions needed for the visualizations.)

## Design requirements

Using techniques from the Storytelling lecture and the [visualization rhetoric paper](http://users.eecs.northwestern.edu/~jhullman/vis_rhetoric.pdf), you will create two visualizations about a dataset that frame the data with opposite narratives.

First, find a dataset about a "controversial" topic. In other words, you want a topic with strong opinions on both sides of the issue. Here are some examples of topics that could work: a political issue, science, religion, sociocultural, economics, immigration, sports, climate change, geopolitical sovereignty, etc. Topics from other regions or countries are also allowed. Good places to look for this data include Kaggle and news organizations that provide access to their data (538, New York Times, etc.).

> **COVID-19 datasets** are NOT allowed, though, you are free to look at examples of opposing COVID visualizations for inspiration.

Next, create your `index.html` page with two visualizations placed side-by-side (one on the left, one on the right). The two visualizations should use the same base dataset. Not all attributes are required to be the the same, and you are free to preprocess the data differently for each visualization (if desired), including aggregating data, filtering data, etc. but use the same source must be used. (In other words, you cannot go find two datasts and merge them together.) 

Above the two charts, you should state the controversial viewpoint/topic/concept/proposition/etc. The left-side visualization should be rhetorically framed to argue "in support" of the viewpoint, and the right-side visualization should be rhetorically framed to argue against the viewpoint. 

> 🔍 A good way to consider this is by posing the topic as a question, and the two visualizations are two opposite answers it. The left-visualization supports the "Yes" answer, and the right-visualization supports the opposite "No" answer. You can also frame it like a debate: one "team" (the left visualization) argues the affirmative position, while the other (the right visualization) argues the negative. 

Again, the trick is that you will use the _same base dataset_ for both visualizations (though, again, the subsets of the data that you pull may be different!), and you'll employ rhetorical techniques to help frame the data in opposing ways. Some examples of how you might do this include: filtering some of the data, picking different attributes to show, using diffrent ranges (timescales, etc), using different granularities, clustering or binning the data, using text annotating on the charts, picking colors or channels to emphasize some aspect of the data. You're allowed to pre-process the data or break up the data into multiple files if necessary. 

The Hullman paper on framing effects describes an extensive collection of framing and styling techniques you can use to help frame your visualizations for promoting a specific viewpoint, story, or argument. You can also the lecture slides for ideas of specific rhetorical techniques. You are free to use any visualization techniques and rhetorical framing devices you like, but you should only create ONE main visualization for each side. (In other words, don’t make a collection of several charts to argue Yes or No, just have one for each side. However, it’s okay to inset or annotate a smaller chart within your primary chart.)

Above each of the charts, add a smaller title that's specific to that chart (this title may also be persuasive for the Yes/No position), and below each chart, provide a brief caption that helps argue that chart's position or point. Then, below that, provide the following paragraphs.

* Introduce the topic and provide a link to the dataset source or URL: Provide a brief (3-4 sentence) description of the chosen topic. In other words, if I'm not familiar with the topic, introduce it here. If you'd like, you may state your personal position on the topic, though that's not required.
* Left chart: Describe the rhetorical techniques or framing effects you are using in this chart, and describe why you think they're persuasive. You should explicitly reference techniques from the lecture/paper!
* Right chart: Provide a similar writeup for the right chart.

## Grading 

This assignment is worth 10 points. Be sure to organize and lay out your page nicely, with nicely styled elements. Up to +2 bonus points will be considered for submissions that go above and beyond (e.g., creating particularly compelling or impressive argumentative visualizations).

> ❗️ In previous years, students have posted this assignment as a part of their portfolio. While we cannot prohibit you from reviewing such charts, you are not allowed to use their code, and we highly recommend not even looking at these until you submitted the assignment. Copying someone else's code/arguments is considered plagiarism.