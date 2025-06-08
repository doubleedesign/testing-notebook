# About

Hi! [I'm Leesa with a Double-E](https://www.doubleedesign.com.au), and I'm a web designer/developer and front-end software engineer with a passion for building robust, maintainable, extensible websites and applications. My approach to development is informed by my cross-section of experiences in agencies, in enterprise, and as a freelancer.

This site is initially a somewhat informal companion to my talk _Catching all the (edge) cases: Getting started with automated testing_ at [WordCamp Brisbane 2025](https://brisbane.wordcamp.org/2025/schedule/), and is also a place to gather my learnings and examples that build upon and expand beyond the content of the talk, continuing into the future.

I hope this site gives you some helpful insight into approaches to automated testing, in WordPress and beyond.

## Background and context

I worked in agencies for over a decade, while also freelancing (which I still do). I describe this job, broadly, as "building websites for people". Of course, most websites are ultimately "for people" - this phrase is meant in the sense that I primarily work(ed) directly with clients in a B2C relationship - people who require a public-facing website for their business, school, club, or other organisation; as opposed to a B2B situation where my clients are other developers. (One exception was an agency I worked for that was one step removed from the end client - our clients were other agencies - but ultimately we were still building specific websites for specific people or organisations, meeting a given set of requirements specific to that project.)

In my experience, many freelance and agency devs are forced to take a tunnel-vision approach to development, where you are under pressure to get a site live as quickly as possible, get client sign-off, and then move on to the next project. Sites are often built or features added with a short-term outlook, at the cost of long-term maintainability and extensibility - which later leads to patchwork fixes, hacks, and workarounds that make the codebase more complex and harder to understand, all because developers are afraid to break something so they don't touch it and instead build on top of it. Testing _really_ thoroughly and preparing for possible future modification or extension of the features you've built is an afterthought, if it happens at all. You might have a staging site where you can test things before going live - but it's a manual process and often misses edge cases.

Since mid-2021 I have been working in enterprise, where I build _applications_ rather than consumer _websites_. This involves working with far bigger teams and more complex codebases that it is impossible for everyone to understand every part of. Automated testing is essential to preventing and fixing regressions and bugs, and to ensuring that new features can be added without breaking existing functionality. By doing this work alongside continuing freelance web development work, I have been able to find ways that automated testing can be selectively used in smaller projects to increase developer confidence, reduce the risk of bugs, and make it easier to understand, maintain, and extend functionality in the future. 

With my talk and this guide, I hope to share that knowledge and experience for the benefit of other developers who may not have had the opportunity to work in an environment where automated testing is a standard part of the workflow.

## Goals

The goal of this site and my WordCamp talk is to empower developers working in the trenches of "building websites for people" to embed automated testing into their workflow to:
1. Reduce the need for repetitive and tedious manual testing to ensure quality and accuracy
2. Increase their confidence in handing over a site or feature to internal QA team members or to a client
3. Reduce back-and-forth about bugs and unexpected behaviour - because they don't occur as often, and when they do, they are easier to diagnose and fix
4. Make changes to existing code without fear of unexpected side effects not being found until it's in the hands of the client or end users, and
5. Help their teammates and future selves understand the requirements and expected behaviour of the code they write, so that it is easier to maintain and extend in the future.

My goal is not specifically to help developers "sell" automated testing to their clients or even to their employers. It doesn't need to be a separate line item on the invoice or step in the project plan (arguably, it probably _shouldn't_ be). My focus is on helping developers understand how to use automated testing to improve their own workflow and the quality of their code, so that they can be more confident in their work and deliver better results for their clients, end users, and each other.

## Disclaimers

This site is not an exhaustive guide and may not document all approaches and tools that may be suitable for your use case, or all considerations you should take into account when planning and implementing your own testing strategy. 

I am not affiliated with any of the tools or services mentioned on this site, and I do not receive any compensation for recommending them. The content of this site is based entirely on my own experience and research. 

Any recommendations made or opinions expressed are my own and should not be taken to reflect the views or opinions of any employer, client, or other organisation I have worked with unless specifically stated otherwise.