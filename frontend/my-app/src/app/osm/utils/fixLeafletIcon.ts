import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';

delete ((L.Icon.Default.prototype as unknown) as { _getIconUrl?: unknown })._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetina.src ?? iconRetina,
    iconUrl: icon.src ?? icon,
    shadowUrl: shadow.src ?? shadow,
});
