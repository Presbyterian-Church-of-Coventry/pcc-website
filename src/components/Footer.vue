<template>
  <footer class="footer has-background-dark has-text-primary has-text-centered">
    <div class="social-icons">
      <a
        href="https://www.facebook.com/Presbyterian-Church-of-Coventry-256826796308/"
        target="_blank"
        rel="noreferrer"
        aria-label="facebook"
        class="inline-flex items-center p-2 rounded-full bg-white text-gray-900 hover:bg-gray-600 hover:text-white"
      >
        <ChurchIcon name="facebook" size="10" />
      </a>
      <a
        href="https://twitter.com/CoventryPCA"
        target="_blank"
        rel="noreferrer"
        aria-label="twitter"
        class="inline-flex items-center p-2 rounded-full bg-white text-gray-900 hover:bg-gray-600 hover:text-white"
      >
        <ChurchIcon name="twitter" size="10" />
      </a>
      <a
        href="https://www.youtube.com/user/PCACoventry"
        target="_blank"
        rel="noreferrer"
        aria-label="youtube"
        class="inline-flex items-center p-2 rounded-full bg-white text-gray-900 hover:bg-gray-600 hover:text-white"
      >
        <ChurchIcon name="youtube" size="10" />
      </a>
    </div>
    <p class="mt-4">
      © 2019
      <a href="https://coventrypca.church">Presbyterian Church of Coventry</a>
      All Rights Reserved
    </p>
    <p>
      <a
        href="https://goo.gl/maps/nKLSRdrN6AJ2"
        target="_blank"
        rel="noreferrer"
        >55 Trowbridge Road, Coventry, CT 06238</a
      >
      | 860-742-7222 |
      <a href="mailto:office@coventrypca.church">office@coventrypca.church</a>
    </p>
    <p>
      Built with ❤️ by our
      <g-link to="/web-team">web team</g-link>.
    </p>
  </footer>
</template>

<style lang="scss" scoped>
@import '@/assets/_colors.scss';

footer.footer {
  line-height: 30px;
  letter-spacing: 1px;
  font-size: 14px;
  color: white !important;
  padding: 3rem 1.5rem;

  p a {
    font-weight: bold;
    color: white;
    &:hover {
      text-decoration: underline;
    }
  }

  .social-icons {
    & > * {
      margin: 0 10px;
    }
  }
}
</style>
