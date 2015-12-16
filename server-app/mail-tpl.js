module.exports = function(variableSym) {
  return ( ' \
 <img src="http://zimni.osudovehry.cz/mail-header.jpg"><br> \
<h1>Registrace byla úspěšná</h1> \
<p>Ahoj,</p> \
<p>Pro jistotu posíláme informace o platbě do e-mailu. Pokud jste to klikli přes Paypal, tak \
tento e-mail můžete bezpečně ignorovat.</p> \
<p>Připomínáme ještě jednou, že po čtyřech dnech bez platby budeme vaši registraci považovat \
za neplatnou. Prosím, dejte vědět, když se s platbou opozdíte.</p> \
<strong>Platební údaje:</strong> \
<ul>  \
  <li><dt>Číslo účtu:</dt> <dd>1437536013&nbsp;/&nbsp;3030 (AirBank)</dd></li> \
  <li><dt>Specifický symbol:</dt> <dd id="specific-symbol">73756416</dd></li> \
  <li><dt>Variabilní symbol:</dt> <dd><span id="variable-symbol">' + variableSym + '</span></dd></li> \
  <li><dt>Částka:</dt> <dd>450 Kč</dd></li> \
</ul> \
<p>&nbsp;</p> \
<p>Před odjezdem budeme ještě rozesílat informační e-maily, nemějte strach.</p> \
<p>Mockrát díky, že s náma jedete. Těšíme se na vás!</p> \
<strong>&nbsp;-&nbsp;Organizační tým Osudovek</strong>' )
}
