---
title: Invalidate CloudFront Cache for Static Website
date: 2022-6-29 00:00:00
tags:
    - beginner
    - cloudfront
---

<!-- EXCERPT START -->
Trashing the cache ensures edge locations have the latest after a fresh commit
<!-- EXCERPT END -->

After getting your static site on S3 deployed to CloudFront, you will notice new changes aren't reflected on the live site. You confirm the Github Action completed. You confirm that the S3 bucket has the latest version of your website. But, when you navigate to it in your browser, you still see the old version. Let's take a look at why this happens and then what we can do to change it.

## Why

Remember, now that the website is using CloudFront it isn't always served from the S3 bucket. Most of the time it's served from edge locations. When they serve it, they are serving a copy of the website. If that copy isn't *updated* then it won't show the latest version. The technical term for the copy of the website that lives at edge locations is **cache**. If we erase the cache then the edge locations will need to call the S3 bucket and grab the latest version, eventually, that is.

After the erase, it doesn't also do the call and grab. That happens when someone, anyone, first routes through that edge location. In other words, you don't erase the cache and then all 300+ edge locations call and grab the latest version of the site.

The fancy word for erase on CloudFront is invalidate. We need to tell CloudFront to invalidate the cache. When should it do that? After we update the contents of our S3 bucket. But since the edge locations aren't aware of when we update the contents of the S3 bucket. CloudFront can't invalidate the cache for us automatically.

## How

There are two ways to invalidate the cache for a CloudFront distribution. You can do it through the console or through the API. If we do it through the console, we would have to do it by hand. That's not going to work. So, we know we need to do it through the API.

One of the easiest ways to use the API is through the command line interface (CLI) [tool](https://aws.amazon.com/cli/) provided by AWS. With that, we can enter a command that will invalidate the cache.

```bash
aws cloudfront create-invalidation /
--distribution-id YOUR-DIST-ID /
--paths '/*' /
--region us-east-1
```

But again, we don't want to have to ourselves enter that command every time we update the site. If you have read the previous posts, you know that we're copying the static website to S3 with a Github Action. Every time we make an update to our site, the Github Action runs. Really it's just a script, and a script is just a bunch of commands. What if we could add the cache invalidate command to that script? Good news, we can!

By doing this with the Github Action, we can be sure that it will happen when we need it to. The site will build, the output copied over to the S3 bucket, then the command to invalidate the cache will run.

Here is the configuration file for the Github Action:

```yaml
name: allowed.cloud S3 sync

on:
  push:
    branches:
    - master

jobs:
  build_deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@master
    - name: Build
      run: |
        npm install && npm run build
    - name: Sync
      uses: jakejarvis/s3-sync-action@master
      with:
        args: --acl public-read --follow-symlinks --delete
      env:
        SOURCE_DIR: 'dist'
        AWS_S3_BUCKET: ${% raw %}{{ secrets.AWS_S3_BUCKET }}{% endraw %}
        AWS_ACCESS_KEY_ID: ${% raw %}{{ secrets.AWS_ACCESS_KEY_ID }}{% endraw %}
        AWS_SECRET_ACCESS_KEY: ${% raw %}{{ secrets.AWS_SECRET_ACCESS_KEY }}{% endraw %}
    - name: Invalidate cache
      env:
        AWS_S3_BUCKET: ${% raw %}{{ secrets.AWS_S3_BUCKET }}{% endraw %}
        AWS_ACCESS_KEY_ID: ${% raw %}{{ secrets.AWS_ACCESS_KEY_ID }}{% endraw %}
        AWS_SECRET_ACCESS_KEY: ${% raw %}{{ secrets.AWS_SECRET_ACCESS_KEY }}{% endraw %}
      run: |
        aws cloudfront create-invalidation \
        --distribution-id YOUR-DIST-ID \
        --paths '/*' \
        --region us-east-1
```

Github Actions are comprised of jobs which are comprised of steps. We have one job and three steps—build, sync, invalidate the cache. Let's look at the last step:

```yaml
    - name: Invalidate cache
      env:
        AWS_S3_BUCKET: ${% raw %}{{ secrets.AWS_S3_BUCKET }}{% endraw %}
        AWS_ACCESS_KEY_ID: ${% raw %}{{ secrets.AWS_ACCESS_KEY_ID }}{% endraw %}
        AWS_SECRET_ACCESS_KEY: ${% raw %}{{ secrets.AWS_SECRET_ACCESS_KEY }}{% endraw %}
      run: |
        aws cloudfront create-invalidation \
        --distribution-id E2213CB65LJCP1 \
        --paths '/*' \
        --region us-east-1
```

It consists of three things—a name, environment variables, the command to run. This command is the exact same one we can run on the command line. The command accepts a distribution ID, a list of files you want to invalidate, and the region that the distribution lives in. 


## Final thoughts

I'm not sure if this is the best way to do it. But it works, and that's half the battle. It seems wasteful to trash the entire cache each time. It would be better to only trash the parts of the cache that are changing. The command to invalidate gives us the option to specify what specifically we want to trash. But, I can't think of a straightforward way to give it that information. Maybe you could use `git diff` and output the results into the invalidate command. I'll have to think more about it.