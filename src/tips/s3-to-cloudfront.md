---
title: Deploy a Static Website on S3 to Cloudfront
date: 2022-05-18
tags:
    - beginner
    - s3
    - cloudfront
---

<!-- EXCERPT START -->
Let's look at the why and how of throwing your website onto Cloudfront
<!-- EXCERPT END -->

Getting content closer to the user will speed up our website. We can do this using AWS CloudFront. It provides a content delivery network (CDN) to distribute our website to the edge. Think of the edge as the location within Amazon's network that is closest to users. Having our website live at the edge, users have to make fewer hops to get to it. This translates into everything taking less time to load. In turn, speeding up the website.

## The Dilemma

Right now our S3 bucket is sitting in Virginia. That is because buckets are regional. There is no one location that houses all the buckets in the world. This means that whenever someone visits our static website, they have to travel to the region that our bucket lives in. My bucket lives in the `us-east-1` region. Depending on where you live, you might have to make a bunch of hops to get to `us-east-1`. This translates into the website taking longer to load.

The only way to remediate this is to change where our website lives. Preferably to an area that is closest to wherever you live. But not only where you live, where everyone lives. So that wherever someone was, they would make the least amount of hops. 
In other words, you made replicas of the website and stored them in special areas throughout the world. Meaning people wouldn't have to travel to `us-east-1` to visit the website. They would instead travel to the special area closest to them.

## Introducing Cloudfront

CloudFront is what can distribute our website to all these special areas called edge locations for us. According to the CloudFront website, there are 300+ edge locations across 47 countries. By moving our website out to the edge, we reduce the number of hops needed to access it. But, this isn't automatic. Meaning when you set up CloudFront, the website isn't instantly distributed to the 300+ edge locations. But, now when a user visits our website their connection gets routed to the edge location. Very quickly, it will check if there is already a copy of the website at that edge location. If there isn't, it will route to the origin location, our S3 bucket. If there is a copy, it doesn't need to! 

CloudFront is something that you will use often since it's always beneficial to get your content as close to the user as possible. It can do a lot of other things too. It allows you to add AWS Shield and AWS WAF that protects against various types of network attacks including DDoS attacks. You can securely transport things with SSL/TLS encryption and HTTPS. There also is the ability to do computing at the edge. CloudFront integrates with CloudWatch, so logging is easy.

## Putting it all together

For everything CloudFront does, it's surprisingly easy to put in place. Start by heading over to the CloudFront console, select **Distributions** and then **Create distribution**. The first field we need to fill in is **Origin domain**.

![Origin domain](/assets/images/cloudfront-1.png)

Our origin is the S3 bucket. By default, CloudFront will suggest S3 bucket _names_ as your origin domain. But that isn't what we need. Instead we need to use our **bucket endpoint** which can be retrieved from the S3 console. Remember, our S3 bucket is special. It is acting like a web server. Which is why we have a **bucket endpoint** for it.

The only other required field is the **Origin name**. Everything else for now can be kept default. Once created, CloudFront will give you a **Distribution domain name**. This is how we can access our website through CloudFront. If you visit that domain, you should see your site! The next step is linking our own domain name to the CloudFront distribution. I'll save that for the next post since I'm trying to keep these short and to the point.

## Final thoughts

With the click of a button, we've deployed our S3 static site to CloudFront. Making it potentially accessible from over 300 edge locations! Pretty wild, huh? You should now have a basic understanding of how CloudFront works. But also why you should use it. Our why is that we want to get content—the static website—closer to our users. We want to do that because it will reduce latency. In other words, stuff will load quicker because it takes fewer hops than before.