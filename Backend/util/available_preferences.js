const default_domains = [
    'Technology',
    'Politics',
    'Sports',
    'Economy',
    'Animals',
    'Music',
    'Video'
];

const default_websites = [
    'www.bbc.com',
    'www.digi24.ro',
    'www.youtube.com',
    'www.spotify.com',
    'www.reddit.com'
];

const all_domains = default_domains.concat([
    'Blogging',
    'Lifestyle',
    'Money',
    'World',
    'Gaming'
]);

const all_websites = default_websites.concat([
    'www.tvr.ro',
    'www.natgeo.com',
    'www.metin2.ro'
]);

module.exports = { default_domains, default_websites, all_domains, all_websites };