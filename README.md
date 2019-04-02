# Certbot authenticator for Gandi API

These commands allow [Certbot][certbot] to automatically renew
locally-generated certificates for domains managed
by [Gandi][gandi].

When certificate is generated locally, Certbot will need a way
to validate the Let’s Encrypt DNS challenge.

The two commands, `certbot-gandi-auth` and `certbot-gandi-clean`
will connect to [Gandi DNS API][gapi] to add the required
DNS TXT records, and clean it after the verification.

## Installation

```bash
git clone https://github.com/jerome-rdlv/certbot-gandi.git
cd certbot-gandi
yarn install
sudo yarn link
```

That last command will install the two commands in your binary
folder (`/usr/local/bin` for example) so they will be
in Certbot PATH during its execution.

## Gandi DNS API key

For the commands to be able to connect Gandi DNS API,
a key is needed. It can be found, or generated, on
https://account.gandi.net/, in the *Security* tab.

That API key must be set in the `GANDI_API_KEY` environment
variable. For example in `/root/.profile` (because Certbot renew
is executed as root):

```bash
export GANDI_API_KEY=XXXXXXXXXXXXXXX
```

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
[gandi]: https://www.gandi.net
[gapi]: https://doc.livedns.gandi.net/
