# Certbot authenticator for Gandi API

(Could use [Certbot Plugin Gandi](https://github.com/obynio/certbot-plugin-gandi) as an alternative.)

These scripts allow [Certbot][certbot] to automatically renew
locally-generated certificates for domains managed
by [Gandi LiveDNS][gapi].

When certificate is generated locally, Certbot will need a way
to validate the Let’s Encrypt DNS challenge.

The two commands, `certbot-gandi-auth` and `certbot-gandi-clean`
will connect to Gandi LiveDNS API to add the required
DNS TXT records, and clean it after the verification.

## Configuration

For the commands to be able to connect Gandi LiveDNS API,
a token is needed. It can be found, or generated, on
https://account.gandi.net/, in the *Security* tab.

That API token must be set in the `GANDI_API_TOKEN` environment
variable. For example in `/root/.profile` (because Certbot renew
is executed as root):

```bash
export GANDI_API_TOKEN=XXXXXXXXXX
```

## Installation

1. `git clone https://github.com/jerome-rdlv/certbot-gandi.git`
2. `cd certbot-gandi`
3. `yarn install`
4. `sudo yarn link`

That last command will install the two scripts in your binary
folder (`/usr/local/bin` for example) so they will be
in Certbot PATH during its execution.

## Usage

For the automatic `renew` to work, the initial generation
command must point to the commands. For example:

```bash
certbot certonly --manual \
    --server https://acme-v02.api.letsencrypt.org/directory \
    --preferred-challenges=dns \
    --manual-auth-hook certbot-gandi-auth \
    --manual-cleanup-hook certbot-gandi-clean \
    -d example.org \
    -d *.example.org \
    -d example.com
```

## Support

I’m interested in any feedback.

## Author

Jérôme Mulsant https://rue-de-la-vieille.fr

[certbot]: https://certbot.eff.org/
[gapi]: https://doc.livedns.gandi.net/
