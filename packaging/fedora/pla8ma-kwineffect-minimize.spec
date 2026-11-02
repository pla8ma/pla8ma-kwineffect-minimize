# Builds the newest state of the main branch:
#   sudo dnf install rpm-build rpmdevtools
#   spectool -g -R pla8ma-kwineffect-minimize.spec
#   rpmbuild -bb pla8ma-kwineffect-minimize.spec
#   sudo dnf install ~/rpmbuild/RPMS/noarch/pla8ma-kwineffect-minimize-*.rpm

%global snapdate %(date +%Y%m%d)
%global effect kwineffect_pla8ma_minimize

Name:           pla8ma-kwineffect-minimize
Version:        0^%{snapdate}
Release:        1%{?dist}
Summary:        Pla8ma minimize animation for KDE Plasma
License:        GPL-2.0-or-later
URL:            https://github.com/pla8ma/pla8ma-kwineffect-minimize
Source0:        %{url}/archive/refs/heads/main.tar.gz#/%{name}-main.tar.gz
BuildArch:      noarch

Requires:       kwin >= 6.6

%description
A minimize effect for KDE Plasma 6, based on KWin's former JavaScript
Squash effect: the window shrinks to just above its taskbar button while it
fades out, and grows back from there when restored. Switch it on in System
Settings > Window Management > Desktop Effects.

%prep
%autosetup -n %{name}-main

%build

%install
mkdir -p %{buildroot}%{_datadir}/kwin/effects/%{effect}
cp -a package/. %{buildroot}%{_datadir}/kwin/effects/%{effect}/

%files
%license LICENSES/GPL-2.0-or-later.txt
%doc README.md
%{_datadir}/kwin/effects/%{effect}/

%changelog
* Mon Nov 02 2026 Pla8ma <johndoe@example.com> - 0^20261102-1
- Snapshot of the main branch
