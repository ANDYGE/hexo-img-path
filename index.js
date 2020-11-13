var deal_image = function (data) {
  if (data && data.content)
    data.content = data.content.replace(
      /!\[(.*?)\]\((\.\.\/)+images\//,
      "![$1](/images/"
    );
};
hexo.extend.filter.register("before_post_render", deal_image, 9);
